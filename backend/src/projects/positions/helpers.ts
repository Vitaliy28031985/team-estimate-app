export const Helpers = {
  multiplication(a: number, b: number): number {
    const result = a * b;
    return result;
  },

  sumData(array: any): number {
    const sum = array.positions.reduce((prevPosition, position) => {
      return prevPosition + position.result;
    }, 0);
    return sum;
  },

  sumEstimate(array: any): number {
    const sum = array.estimates.reduce((prevPosition, position) => {
      return prevPosition + position.total;
    }, 0);
    return sum;
  },

  getGeneral(a: number, b: number, c: number, d: number): number {
    const result = a + b - c - d;
    return result;
  },
  sumMaterials(array: any): number {
    const sum = array.reduce((prevMaterial, material) => {
      return prevMaterial + material.sum;
    }, 0);
    return sum;
  },
  sumLowEstimates(array: any): number {
    const sum = array.lowEstimates.reduce((prevPosition, position) => {
      return prevPosition + position.total;
    }, 0);
    return sum;
  },
};