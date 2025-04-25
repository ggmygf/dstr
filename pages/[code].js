import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function SecretPage() {
  const router = useRouter();
  const { code } = router.query;
  const [secret, setSecret] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (code) {
      fetch(`/api/lookup?code=${code}`)
        .then(response => {
          if (response.ok) {
            return response.text();
          } else if (response.status === 404) {
            setError('Code not found or already used.');
          } else {
            setError('Failed to retrieve secret.');
          }
        })
        .then(data => setSecret(data))
        .catch(err => {
          console.error('Fetch error:', err);
          setError('Failed to retrieve secret.');
        });
    }
  }, [code]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (secret) {
    return <div>{secret}</div>;
  }

  return <div>Checking code...</div>;
}
