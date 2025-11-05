import { logEvent, logError, logSuccess } from "@/lib/logger";

export function withMonitoring(handler: Function, layer: string) {
  return async (req: Request) => {
    const start = performance.now();
    const action = `${req.method} ${new URL(req.url).pathname}`;
    
    try {
      const res = await handler(req);
      const latency = Math.round(performance.now() - start);
      
      await logSuccess(layer, action, { 
        latency,
        statusCode: res.status || 200,
        url: req.url 
      });
      
      return res;
    } catch (err: any) {
      const latency = Math.round(performance.now() - start);
      
      await logError(layer, action, err, { 
        latency,
        url: req.url,
        method: req.method 
      });
      
      throw err;
    }
  };
}

export function withAsyncMonitoring(handler: Function, layer: string) {
  return async (...args: any[]) => {
    const start = performance.now();
    const action = handler.name || "unknown_action";
    
    try {
      const result = await handler(...args);
      const latency = Math.round(performance.now() - start);
      
      await logSuccess(layer, action, { 
        latency,
        resultType: typeof result 
      });
      
      return result;
    } catch (err: any) {
      const latency = Math.round(performance.now() - start);
      
      await logError(layer, action, err, { 
        latency,
        args: args.length 
      });
      
      throw err;
    }
  };
}











