import * as XLSX from "xlsx";

const createWorkbook = (data) => {
  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Sheet1"
  );

  return workbook;
};

export const exportToExcel = (
  data,
  fileName = "export"
) => {
  if (!data?.length) return;

  const workbook = createWorkbook(data);

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToCSV = (
  data,
  fileName = "export"
) => {
  if (!data?.length) return;

  const workbook = createWorkbook(data);

  XLSX.writeFile(workbook, `${fileName}.csv`, {
    bookType: "csv",
  });
};