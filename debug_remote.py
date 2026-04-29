import pty
import os
import time
import sys

def debug_remote():
    pid, fd = pty.fork()
    if pid == 0:
        os.execvp('ssh', ['ssh', '-o', 'StrictHostKeyChecking=no', 'root@83.217.221.84'])
    else:
        # Wait for password prompt
        output = b""
        start_time = time.time()
        while time.time() - start_time < 15:
            try:
                data = os.read(fd, 1024)
                output += data
                if b'password:' in output.lower():
                    os.write(fd, b'dLf_^B4DpgR5q#\n')
                    print("Password sent.")
                    break
            except:
                time.sleep(0.1)
        
        time.sleep(5)
        
        # Send commands
        os.write(fd, b'export TERM=xterm\npm2 list\npm2 logs hessa-website --lines 50 --no-daemon\n')
        
        # Read for a long time
        end_time = time.time() + 20
        while time.time() < end_time:
            try:
                data = os.read(fd, 4096)
                if data:
                    print(data.decode('utf-8', errors='ignore'), end='')
                    sys.stdout.flush()
            except:
                time.sleep(0.5)

if __name__ == '__main__':
    debug_remote()
