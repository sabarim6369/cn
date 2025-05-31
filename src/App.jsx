import { useState } from 'react';
import './App.css';

function App() {
  const [visible, setVisible] = useState(null);

  const toggleSection = (type) => {
    setVisible((prev) => (prev === type ? null : type));
  };

  // Example files
const examples = [
  '7.pkt',
  '10.pkt',
  'distance vector exp 3.pkt',
  'Linkstaterouting.pkt',
  '2.pkt'
  
  // ... add more filenames as needed
];

  return (
    <div className="container">
      <div className="buttons">
        <button onClick={() => toggleSection('tcp')}>TCP</button>
        <button onClick={() => toggleSection('udp')}>UDP</button>
        <button onClick={() => toggleSection('examples')}>Examples</button>
      </div>

      {/* TCP */}
      {visible === 'tcp' && (
        <div id="tcp">
          <h2>TCP Server (Node.js)</h2>
          <pre><code>{`// TCP Server
const net = require('net');

const server = net.createServer((socket) => {
  console.log('Connection Established');

  socket.on('data', (data) => {
    console.log('Client said:', data.toString());
    socket.write(data.toString()); // Echoing back
  });

  socket.on('close', () => {
    console.log('Connection closed');
  });
});

server.listen(4550, '0.0.0.0', () => {
  console.log('Server is listening on 127.0.0.1:4550');
});`}</code></pre>

          <h2>TCP Client (Node.js)</h2>
          <pre><code>{`// TCP Client
const net = require('net');
const readline = require('readline');

const client = new net.Socket();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

client.connect(4550, '0.0.0.0', () => {
  console.log('Connection Established');

  rl.question('Enter the data: ', (input) => {
    client.write(input);
  });
});

client.on('data', (data) => {
  console.log('FROM SERVER:', data.toString());
  console.log('Echo Received');
  client.end();
  rl.close();
});

client.on('close', () => {
  console.log('Connection closed');
});`}</code></pre>
        </div>
      )}

      {/* UDP */}
      {visible === 'udp' && (
        <div id="udp">
          <h2>UDP Server (Node.js)</h2>
          <pre><code>{`// UDP Server
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('listening', () => {
  const address = server.address();
  console.log(\`Server listening on \${address.address}:\${address.port}\`);
});

server.on('message', (msg, rinfo) => {
  console.log(\`Received: "\${msg}" from \${rinfo.address}:\${rinfo.port}\`);
  server.send(msg, rinfo.port, rinfo.address, (err) => {
    if (err) console.error('Error sending response:', err);
    else console.log('Echoed back to client');
  });
});

server.bind(4550, '127.0.0.1');`}</code></pre>

          <h2>UDP Client (Node.js)</h2>
          <pre><code>{`// UDP Client
const dgram = require('dgram');
const readline = require('readline');

const client = dgram.createSocket('udp4');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter a message: ', (input) => {
  client.send(input, 4550, '127.0.0.1', (err) => {
    if (err) console.error('Send error:', err);
  });
});

client.on('message', (msg, rinfo) => {
  console.log(\`FROM SERVER: \${msg.toString()}\`);
  client.close();
  rl.close();
});`}</code></pre>
        </div>
      )}

      {/* Examples */}
      {visible === 'examples' && (
        <div id="examples">
          <h2>Example Files</h2>
          <ul>
            {examples.map((file) => (
              <li key={file}>
                <a href={`/${file}`} download>{file}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
