import { spawn } from "child_process";

export async function runPython(script: string, args: string[] = []): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = spawn("python", [script, ...args]);
    let output = "";
    let error = "";

    process.stdout.on("data", (data) => (output += data.toString()));
    process.stderr.on("data", (data) => (error += data.toString()));

    process.on("close", (code) => {
      if (code === 0) resolve(output.trim());
      else reject(new Error(error));
    });
  });
}













