const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

function dataUriToBlob(dataUri: string): Blob {
  const [header, base64] = dataUri.split(',');
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/**
 * Sends the wound image to the backend and returns the triage prediction.
 * true  = exploration chirurgicale (SOS main)
 * false = prise en charge non spécialisée
 */
export async function demanderAvis(imageUri: string, localisation?: string, meca?: string): Promise<boolean> {
  const blob = dataUriToBlob(imageUri);
  const form = new FormData();
  form.append('file', blob, 'photo.jpg');
  if (localisation) form.append('loc_recoded', localisation);
  if (meca) form.append('meca', meca);

  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    body: form,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`API error ${response.status}: ${detail}`);
  }

  const result = await response.json();
  return result.prediction === 1;
}
