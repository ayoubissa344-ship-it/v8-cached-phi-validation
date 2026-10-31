// Diagnostic extension of escape-analysis-nested-loop-revisit.js.
// Flags: --allow-natives-syntax --no-maglev-loop-peeling --turbolev
// Flags: --turbolev-escape-analysis

function Wrapper(val) {
  this.f = val;
}

function test() {
  const wrapper = new Wrapper(0);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let cur = wrapper.f;

      if ((i & 1) === 0) {
        wrapper.f = (j + 1) | 0;
      } else {
        wrapper.f = j + 1;
      }

      cur = wrapper.f;
    }

    wrapper.f = (i & 1) === 0 ? 42 : 42.5;
  }

  return wrapper.f;
}

%PrepareFunctionForOptimization(Wrapper);
%PrepareFunctionForOptimization(test);

test();
%OptimizeFunctionOnNextCall(test);

const result = test();
print("PHI_REUSE_TARGET_RESULT", result);
