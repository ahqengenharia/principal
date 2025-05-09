
/**
 * Validates and identifies outliers in data using Z-Score or Modified Z-Score methods
 */

interface ValidationResult {
  outliers: any[];
  stats: {
    mean?: number;
    stdDev?: number;
    median?: number;
    mad?: number;
  }
}

/**
 * Calculate Z-Score for each data point
 * Z-Score = (x - mean) / stdDev
 * Values with |Z-Score| > 3 are considered outliers
 */
const calculateZScore = (data: any[], columnName: string): ValidationResult => {
  // Extract numeric values from the specified column
  const values = data
    .map(item => parseFloat(item[columnName]))
    .filter(value => !isNaN(value));
  
  if (values.length === 0) {
    throw new Error("No numeric values found in the specified column");
  }
  
  // Calculate mean
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  
  // Calculate standard deviation
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  if (stdDev === 0) {
    // Can't calculate Z-scores with zero standard deviation
    return { outliers: [], stats: { mean, stdDev: 0 } };
  }
  
  // Calculate Z-scores and find outliers
  const outliers = data.filter(item => {
    const value = parseFloat(item[columnName]);
    if (isNaN(value)) return false;
    
    const zScore = Math.abs((value - mean) / stdDev);
    return zScore > 3; // Z-score threshold for outliers
  });
  
  return {
    outliers,
    stats: { mean, stdDev }
  };
};

/**
 * Calculate Modified Z-Score for each data point
 * Modified Z-Score = 0.6745 * (x - median) / MAD
 * Where MAD = median(|x - median|)
 * Values with |Modified Z-Score| > 3.5 are considered outliers
 */
const calculateModifiedZScore = (data: any[], columnName: string): ValidationResult => {
  // Extract numeric values from the specified column
  const values = data
    .map(item => parseFloat(item[columnName]))
    .filter(value => !isNaN(value));
  
  if (values.length === 0) {
    throw new Error("No numeric values found in the specified column");
  }
  
  // Calculate median
  const sortedValues = [...values].sort((a, b) => a - b);
  const median = sortedValues.length % 2 === 0
    ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
    : sortedValues[Math.floor(sortedValues.length / 2)];
  
  // Calculate MAD (Median Absolute Deviation)
  const absoluteDeviations = values.map(value => Math.abs(value - median));
  const sortedDeviations = [...absoluteDeviations].sort((a, b) => a - b);
  const mad = sortedDeviations.length % 2 === 0
    ? (sortedDeviations[sortedDeviations.length / 2 - 1] + sortedDeviations[sortedDeviations.length / 2]) / 2
    : sortedDeviations[Math.floor(sortedDeviations.length / 2)];
  
  if (mad === 0) {
    // Can't calculate Modified Z-scores with zero MAD
    return { outliers: [], stats: { median, mad: 0 } };
  }
  
  // Calculate Modified Z-scores and find outliers
  const outliers = data.filter(item => {
    const value = parseFloat(item[columnName]);
    if (isNaN(value)) return false;
    
    const modifiedZScore = Math.abs(0.6745 * (value - median) / mad);
    return modifiedZScore > 3.5; // Modified Z-score threshold for outliers
  });
  
  return {
    outliers,
    stats: { median, mad }
  };
};

/**
 * Validate data and identify outliers
 */
export const validateData = async (
  data: any[],
  columnName: string,
  method: 'zScore' | 'modifiedZScore' = 'zScore'
): Promise<ValidationResult> => {
  try {
    // Store data in database (simulated)
    console.log(`Storing ${data.length} records in [dados-brutos] database...`);
    
    // For browser simulation, store in localStorage
    localStorage.setItem('dados-brutos', JSON.stringify(data));
    
    // Apply the selected validation method
    if (method === 'zScore') {
      return calculateZScore(data, columnName);
    } else {
      return calculateModifiedZScore(data, columnName);
    }
  } catch (error) {
    console.error('Error in data validation:', error);
    throw error;
  }
};
