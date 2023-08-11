import subprocess
import sys

# Replace this with the actual path to your TypeScript file
typescript_file_path = "index.ts"

# Command to run TypeScript using ts-node
ts_node_command = ["./node_modules/.bin/ts-node", typescript_file_path]

try:
    process = subprocess.Popen(
        ts_node_command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1  # Line-buffered output
    )

    # Capture and print the standard output and error in real-time
    for line in process.stdout:
        print(line.strip())
    for line in process.stderr:
        print("stderr:", line.strip())

    # Wait for the process to complete
    process.wait()

    if process.returncode != 0:
        print("TypeScript process exited with an error.")
        sys.exit(1)  # Terminate the Python script with a non-zero exit code

except Exception as e:
    print("An error occurred:", str(e))
    sys.exit(1)  # Terminate the Python script with a non-zero exit code
