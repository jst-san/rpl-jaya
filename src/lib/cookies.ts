export async function getAccessToken() {
  const access_token = await cookieStore.get("access_token");

  if (!access_token) {
    window.location.reload();
  }

  return access_token?.value;
}
