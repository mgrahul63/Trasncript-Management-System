// Function to print only the table content with correct styling
export const printTable = (tableId) => {
  const printContent = document.getElementById(tableId).outerHTML;
  const printWindow = window.open("", "_blank", "width=900,height=900");

  printWindow.document.write("<html><head><title>Print</title>");
  // Adding basic table styles for print
  printWindow.document.write(`
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        table, th, td {
          border: 1px solid black;
        }
        th, td {
          padding: 8px;
          text-align: center;
        }
        th {
          background-color: #f2f2f2;
        }
      </style>
    `);
  printWindow.document.write("</head><body>");
  printWindow.document.write(printContent);
  printWindow.document.write("</body></html>");
  printWindow.document.close();
  printWindow.print();
};
