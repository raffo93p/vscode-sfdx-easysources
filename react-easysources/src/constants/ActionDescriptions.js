/**
 * Descrizioni delle action disponibili
 */
export const ACTION_DESCRIPTIONS = {
  split: "Splits the resources into various CSV files, and creates an XML file containing all the tags that weren't split",
  merge: "Merges back all the resources previously split from CSV files into XML format",
  upsert: "Similar to split, but adds new entries to existing CSV files instead of recreating them",
  customupsert: "Inserts or updates specific entries in CSV files using JSON content, with automatic key calculation and smart field handling",
  updatekey: "Updates the _tagid column when developers make changes directly in CSV files",
  delete: "Bulk deletes a single permission from all resources of the same type",
  minify: "Removes entries that don't add value to the file",
  clean: "Removes all references that are not present in the target org or in the repository",
  clearempty: "Removes empty CSV files and folders from the generated CSV files ",
  arealigned: "Validates alignment between XML and CSV representations, ensuring data integrity with logic or string comparison modes"
};

/**
 * Descrizioni dei mode per l'action Are Aligned
 */
export const ARE_ALIGNED_MODE_DESCRIPTIONS = {
  string: "Recreates XML files from CSV and compares the result with the original XML files",
  logic: "Logically compares all keys and values between XML and CSV representations"
};
