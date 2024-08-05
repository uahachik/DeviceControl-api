import vm from 'node:vm';
import { performance } from 'node:perf_hooks';

export type Performer = (cleanedContent: string) => Promise<{
  regexWithEvalMetrics: {
    totalDuration: number;
    totalCpuUsage: {
      user: number;
      system: number;
    };
    totalMemoryUsage: number;
  };
  contextMetrics: {
    totalDuration: number;
    totalCpuUsage: {
      user: number;
      system: number;
    };
    totalMemoryUsage: number;
  };
}>;

function createMeasurementFunction(fn: (cleanedContent: string) => void) {
  let totalDuration = 0;
  let totalCpuUsage = { user: 0, system: 0 };
  let totalMemoryUsage = 0;

  return async function measure(cleanedContent: string) {
    const startMemoryUsage = process.memoryUsage().heapUsed;
    const startCpuUsage = process.cpuUsage();
    const startTime = performance.now();
    // console.time('Regex with Eval Execution Time');

    fn(cleanedContent);

    const endTime = performance.now();
    // console.timeEnd('Regex with Eval Execution Time');
    const endCpuUsage = process.cpuUsage(startCpuUsage);
    const endMemoryUsage = process.memoryUsage().heapUsed;

    // calculations
    const duration = endTime - startTime;
    // console.log('duration', duration);
    totalDuration += duration;
    // console.log('totalDuration,', totalDuration, fn.toString());

    totalCpuUsage = { user: totalCpuUsage.user += endCpuUsage.user, system: totalCpuUsage.system += endCpuUsage.system };

    const memoryUsage = endMemoryUsage - startMemoryUsage;
    totalMemoryUsage += memoryUsage;

    return { totalDuration, totalCpuUsage, totalMemoryUsage };
  };
}

const measureRegexWithEval = createMeasurementFunction((cleanedContent: string) => {
  const sanitizedContent = cleanedContent.replace(/\/\/# sourceMappingURL=.*$/gm, '');
  eval(sanitizedContent);
});

const measureVmContext = createMeasurementFunction((cleanedContent: string) => {
  // Deriving schema list in Node.js sandbox
  const wrappedContent = `
  (function() {
    return ${cleanedContent};
  })();
`;
  const context = vm.createContext({});
  const script = new vm.Script(wrappedContent);
  script.runInContext(context);
});

function measurePerformance() {
  return async (cleanedContent: string) => {
    const regexWithEvalMetrics = await measureRegexWithEval(cleanedContent);
    const contextMetrics = await measureVmContext(cleanedContent);
    return { regexWithEvalMetrics, contextMetrics };
  };
}
const performer = measurePerformance();
export default performer;