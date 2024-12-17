console.log('Command line arguments:', process.argv);

const AUTH_API_URL = process.argv[2] || 'http://localhost:3000/graphql';

const LOGIN_MUTATION = `
    mutation Login($loginInput: LoginInput!) {
        login(loginInput: $loginInput) {
            id
        }
    }
`;

const JOBS_API_URL = process.argv[3] || 'http://localhost:3001/graphql';

const EXECUTE_JOB_MUTATION = `
    mutation ExecuteJob($executeJobInput: ExecuteJobInput!) {
        executeJob(executeJobInput: $executeJobInput) {
            name
        }
    }
`;

async function login(email, password) {
  const response = await fetch(AUTH_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: LOGIN_MUTATION,
      variables: { loginInput: { email, password } },
    }),
  });

  const data = await response.json();
  const cookies = response.headers.get('set-cookie');
  return { data, cookies };
}

async function executeJobWithInput(executeJobInput, cookies) {
  const response = await fetch(JOBS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookies },
    body: JSON.stringify({
      query: EXECUTE_JOB_MUTATION,
      variables: { executeJobInput },
    }),
  });

  const data = await response.json();
  return data;
}

(async () => {
  const { data: loginData, cookies } = await login(
    'michael@michaelguay.dev',
    'SomeTestPassword123!'
  );
  if (loginData?.data.login.id) {
    const n = parseInt(process.argv[4], 10) || 1000;
    console.log(`Executing Fibonacci with n = ${n}`);
    const executeJobInput = {
      name: 'Fibonacci',
      data: Array.from({ length: n }, () => ({
        iterations: Math.floor(Math.random() * 5000) + 1,
      })),
    };
    const data = await executeJobWithInput(executeJobInput, cookies);
    console.log(data);
  } else {
    console.error('Login failed');
  }
})();
