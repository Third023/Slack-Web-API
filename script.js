// async function sendMessage() {
//   const channel = document.getElementById('channel').value;
//   const text = document.getElementById('message').value;

//   const res = await fetch('http://localhost:3000/send-message', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ channel, text })
//   });

//   const data = await res.json();
//   document.getElementById('status').innerText =
//     data.ok ? '✅ Message sent!' : `❌ ${data.error}`;
// }

// Check login status when page loads
window.onload = async () => {
  const res = await fetch('http://localhost:3000/status');
  const data = await res.json();

  if (data.loggedIn) {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('appSection').style.display = 'block';

    document.getElementById('logoutBtn').addEventListener('click', async () => {
      await fetch('http://localhost:3000/logout', { method: 'POST' });
      location.reload(); // Show login section again
    _});
  }
};

async function sendMessage() {
  const channel = document.getElementById('channel').value;
  const text = document.getElementById('message').value;

  const res = await fetch('http://localhost:3000/send-message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channel, text })
  });

  const data = await res.json();
  document.getElementById('status').innerText =
    data.ok ? '✅ Message sent!' : `❌ ${data.error}`;
}

async function logout() {
  await fetch('http://localhost:3000/logout', { method: 'POST' });
  location.reload();
}
