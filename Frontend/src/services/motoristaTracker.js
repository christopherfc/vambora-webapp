import {
  motoristaAtualizarLocalizacao,
  motoristaParar,
} from "./api.js";

const STORAGE_KEY = "vambora_motorista_viagem";
const SEND_INTERVAL_MS = 5000;

let watchId = null;
let sendTimer = null;
let activeTrip = null;
let lastPosition = null;
let lastError = "";
const listeners = new Set();

function notify() {
  const state = getMotoristaTrackerState();
  listeners.forEach((listener) => listener(state));
}

function saveTrip(trip) {
  activeTrip = trip;
  if (trip) localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
  else localStorage.removeItem(STORAGE_KEY);
  notify();
}

function readStoredTrip() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

async function sendPosition() {
  if (!activeTrip || !lastPosition) return;

  const payload = {
    linhaId: Number(activeTrip.linhaId),
    latitude: lastPosition.coords.latitude,
    longitude: lastPosition.coords.longitude,
    precisao: lastPosition.coords.accuracy,
  };

  await motoristaAtualizarLocalizacao(payload);
  activeTrip = { ...activeTrip, ultimaAtualizacao: new Date().toISOString(), ultima: payload };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activeTrip));
  lastError = "";
  notify();
}

function ensureSendTimer() {
  if (sendTimer) clearInterval(sendTimer);
  sendTimer = setInterval(() => {
    sendPosition().catch((error) => {
      lastError = error.message || "Erro ao enviar localizacao.";
      notify();
    });
  }, SEND_INTERVAL_MS);
}

export function subscribeMotoristaTracker(listener) {
  listeners.add(listener);
  listener(getMotoristaTrackerState());
  return () => listeners.delete(listener);
}

export function getMotoristaTrackerState() {
  return {
    ativo: Boolean(activeTrip),
    trip: activeTrip,
    ultima: activeTrip?.ultima || null,
    erro: lastError,
  };
}

export function resumeMotoristaTracker() {
  const stored = readStoredTrip();
  if (!stored || activeTrip) return;
  startMotoristaTracker(stored.linhaId, stored.linhaNome).catch((error) => {
    lastError = error.message || "Nao foi possivel retomar a viagem.";
    notify();
  });
}

export async function startMotoristaTracker(linhaId, linhaNome = "") {
  if (!navigator.geolocation) {
    throw new Error("Seu navegador nao suporta geolocalizacao.");
  }

  saveTrip({
    linhaId: Number(linhaId),
    linhaNome,
    iniciadoEm: new Date().toISOString(),
    ultimaAtualizacao: null,
    ultima: null,
  });

  if (watchId !== null) navigator.geolocation.clearWatch(watchId);
  watchId = navigator.geolocation.watchPosition(
    (position) => {
      lastPosition = position;
      sendPosition().catch((error) => {
        lastError = error.message || "Erro ao enviar localizacao.";
        notify();
      });
    },
    (error) => {
      lastError = error.message || "Nao foi possivel obter sua localizacao.";
      notify();
    },
    { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 }
  );

  ensureSendTimer();
}

export async function stopMotoristaTracker() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  if (sendTimer) {
    clearInterval(sendTimer);
    sendTimer = null;
  }
  lastPosition = null;
  saveTrip(null);
  await motoristaParar();
}
