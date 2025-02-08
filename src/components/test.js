import React, { useState } from "react";

export const Invoice = () => {
  // Static company details
  const companyDetails = {
    name: "HP TILES",
    address1: "123 Tile Street",
    address2: "Tile City, State, 12345",
    gstin: "GSTIN123456",
    mobile: "123-456-7890",
    pan: "PAN123456",
  };

  const [formData, setFormData] = useState({
    address1: "",
    address2: "",
    gstin: "",
    mobile: "",
    pan: "",
    invoiceNo: "",
    invoiceDate: "",
    clientName: "",
    clientAddress: "",
    clientGstin: "",
    clientState: "",
    items: [], // Array to hold multiple items
    bankName: "",
    ifsc: "",
    accountNo: "",
    branch: "",
    upiId: "",
    taxableAmount: "",
    cgst: "",
    sgst: "",
    freight: "",
    totalAmount: "",
    amountInWords: "",
    signature: "" // Add a valid signature image URL
  });

  const [item, setItem] = useState({
    itemNo: "",
    itemName: "",
    quantity: "",
    rate: "",
    amount: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const addItem = () => {
    const newItem = {
      ...item,
      amount: (parseFloat(item.quantity) * parseFloat(item.rate)).toFixed(2) // Calculate amount
    };
    setFormData((prevData) => ({
      ...prevData,
      items: [...prevData.items, newItem]
    }));
    setItem({ itemNo: "", itemName: "", quantity: "", rate: "", amount: "" }); // Reset item input
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-[800px] p-8 bg-white rounded-lg shadow-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Create Invoice</h2>
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-left">
              <h1 className="text-2xl font-bold mb-2 hover:text-blue-600 transition-colors duration-300">{companyDetails.name}</h1>
              <p className="text-sm">{companyDetails.address1}</p>
              <p className="text-sm">{companyDetails.address2}</p>
              <p className="text-sm">GSTIN: {companyDetails.gstin}</p>
              <p className="text-sm">Mobile: {companyDetails.mobile}</p>
              <p className="text-sm">PAN: {companyDetails.pan}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold mb-4 hover:text-blue-600 transition-colors duration-300">TAX INVOICE</h2>
              <div className="flex justify-end gap-4">
                <div>
                  <p className="text-sm">Invoice No. :</p>
                  <p className="text-sm">Invoice Date :</p>
                </div>
                <div>
                  <input
                    name="invoiceNo"
                    type="text"
                    value={formData.invoiceNo}
                    onChange={handleChange}
                    placeholder="INV-2024-001"
                    className="text-sm w-full mb-1 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <input
                    name="invoiceDate"
                    type="date"
                    value={formData.invoiceDate}
                    onChange={handleChange}
                    className="text-sm w-full p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <h3 className="font-semibold mb-2">BILL TO</h3>
            <input
              name="clientName"
              type="text"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Client Name"
              className="text-sm w-full mb-1 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              name="clientAddress"
              type="text"
              value={formData.clientAddress}
              onChange={handleChange}
              placeholder="Client Address"
              className="text-sm w-full mb-1 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              name="clientGstin"
              type="text"
              value={formData.clientGstin}
              onChange={handleChange}
              placeholder="Client GSTIN"
              className="text-sm w-full mb-1 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              name="clientState"
              type="text"
              value={formData.clientState}
              onChange={handleChange}
              placeholder="Client State"
              className="text-sm w-full p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-8">
            <h3 className="font-semibold mb-2">ITEMS</h3>
            <div className="flex space-x-2">
              <input
                name="itemNo"
                type="text"
                value={item.itemNo}
                onChange={handleItemChange}
                placeholder="Item No"
                className="text-sm w-1/4 p-1 border rounded"
                required
              />
              <input
                name="itemName"
                type="text"
                value={item.itemName}
                onChange={handleItemChange}
                placeholder="Item Name"
                className="text-sm w-1/4 p-1 border rounded"
                required
              />
              <input
                name="quantity"
                type="number"
                value={item.quantity}
                onChange={handleItemChange}
                placeholder="Quantity"
                className="text-sm w-1/4 p-1 border rounded"
                required
              />
              <input
                name="rate"
                type="number"
                value={item.rate}
                onChange={handleItemChange}
                placeholder="Rate"
                className="text-sm w-1/4 p-1 border rounded"
                required
              />
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Item
              </button>
            </div>
          </div>

          <table className="w-full mt-4">
            <thead className="bg-[#fddbc2]">
              <tr>
                <th className="p-2 text-left">S.NO.</th>
                <th className="p-2 text-left">ITEMS</th>
                <th className="p-2 text-right">QTY</th>
                <th className="p-2 text-right">RATE</th>
                <th className="p-2 text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index}>
                  <td className="p-2">{item.itemNo}</td>
                  <td className="p-2">{item.itemName}</td>
                  <td className="p-2 text-right">{item.quantity}</td>
                  <td className="p-2 text-right">{item.rate}</td>
                  <td className="p-2 text-right">{item.amount}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#fddbc2]">
              <tr>
                <th className="p-2 text-left">SUBTOTAL</th>
                <th className="p-2"></th>
                <th className="p-2 text-right">{formData.items.reduce((acc, curr) => acc + parseFloat(curr.quantity || 0), 0)}</th>
                <th className="p-2"></th>
                <th className="p-2 text-right">{calculateSubtotal()}</th>
              </tr>
            </tfoot>
          </table>

          <div className="flex justify-between mt-4">
            <div className="w-1/2">
              <div className="mb-4 p-4 border rounded">
                <h3 className="font-semibold mb-2">BANK DETAILS</h3>
                <input
                  name="bankName"
                  type="text"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Bank Name"
                  className="text-sm w-full mb-1 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  name="ifsc"
                  type="text"
                  value={formData.ifsc}
                  onChange={handleChange}
                  placeholder="IFSC Code"
                  className="text-sm w-full mb-1 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  name="accountNo"
                  type="text"
                  value={formData.accountNo}
                  onChange={handleChange}
                  placeholder="Account Number"
                  className="text-sm w-full mb-1 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  name="branch"
                  type="text"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="Bank Branch"
                  className="text-sm w-full p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="p-4 border rounded">
                <h3 className="font-semibold mb-2">PAYMENT QR CODE</h3>
                <p className="text-sm">UPI ID: {formData.upiId}</p>
              </div>
            </div>
            <div className="w-1/2">
              <table className="w-full mb-4">
                <tbody>
                  <tr>
                    <td className="py-1 text-right">TAXABLE AMOUNT</td>
                    <td className="py-1 text-right">
                      <input
                        name="taxableAmount"
                        type="number"
                        step="0.01"
                        value={formData.taxableAmount}
                        onChange={handleChange}
                        className="w-32 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 text-right">CGST @9%</td>
                    <td className="py-1 text-right">
                      <input
                        name="cgst"
                        type="number"
                        step="0.01"
                        value={formData.cgst}
                        onChange={handleChange}
                        className="w-32 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 text-right">SGST @9%</td>
                    <td className="py-1 text-right">
                      <input
                        name="sgst"
                        type="number"
                        step="0.01"
                        value={formData.sgst}
                        onChange={handleChange}
                        className="w-32 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 text-right">Freight</td>
                    <td className="py-1 text-right">
                      <input
                        name="freight"
                        type="number"
                        step="0.01"
                        value={formData.freight}
                        onChange={handleChange}
                        className="w-32 p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </td>
                  </tr>
                  <tr className="font-semibold">
                    <td className="py-1 text-right">TOTAL AMOUNT</td>
                    <td className="py-1 text-right">
                      {parseFloat(calculateSubtotal()) + parseFloat(formData.cgst || 0) + parseFloat(formData.sgst || 0) + parseFloat(formData.freight || 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="text-right mt-4">
                <p className="text-sm">Total Amount (in words):</p>
                <input
                  name="amountInWords"
                  type="text"
                  value={formData.amountInWords}
                  onChange={handleChange}
                  className="w-full p-1 border rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="mt-8 text-right">
                <input
                  name="signature"
                  type="file"
                  accept="image/*"
                  className="mb-2"
                  onChange={(e) => setFormData({ ...formData, signature: URL.createObjectURL(e.target.files[0]) })}
                  required
                />
                <p className="text-sm">
                  Authorised Signature for
                  <br />
                  {companyDetails.name}
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2"
          >
            Generate Invoice
          </button>
        </form>
      ) : (
        <div id="invoice">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{companyDetails.name}</h1>
              <p className="text-sm mb-1">{companyDetails.address1}</p>
              <p className="text-sm mb-1">{companyDetails.address2}</p>
              <p className="text-sm mb-1">GSTIN: {companyDetails.gstin}</p>
              <p className="text-sm mb-1">Mobile: {companyDetails.mobile}</p>
              <p className="text-sm">PAN: {companyDetails.pan}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold mb-4">TAX INVOICE</h2>
              <div className="flex justify-end gap-4">
                <div>
                  <p className="text-sm">Invoice No.: {formData.invoiceNo}</p>
                  <p className="text-sm">Invoice Date: {formData.invoiceDate}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#fddbc2] p-4 rounded">
            <h3 className="font-semibold mb-2">BILL TO</h3>
            <p className="text-sm mb-1">{formData.clientName}</p>
            <p className="text-sm mb-1">{formData.clientAddress}</p>
            <p className="text-sm mb-1">GSTIN: {formData.clientGstin}</p>
            <p className="text-sm">State: {formData.clientState}</p>
          </div>

          <table className="w-full mt-4">
            <thead className="bg-[#fddbc2]">
              <tr>
                <th className="p-2 text-left">S.NO.</th>
                <th className="p-2 text-left">ITEMS</th>
                <th className="p-2 text-right">QTY</th>
                <th className="p-2 text-right">RATE</th>
                <th className="p-2 text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index}>
                  <td className="p-2">{item.itemNo}</td>
                  <td className="p-2">{item.itemName}</td>
                  <td className="p-2 text-right">{item.quantity}</td>
                  <td className="p-2 text-right">{item.rate}</td>
                  <td className="p-2 text-right">{item.amount}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#fddbc2]">
              <tr>
                <th className="p-2 text-left">SUBTOTAL</th>
                <th className="p-2"></th>
                <th className="p-2 text-right">{formData.items.reduce((acc, curr) => acc + parseFloat(curr.quantity || 0), 0)}</th>
                <th className="p-2"></th>
                <th className="p-2 text-right">{calculateSubtotal()}</th>
              </tr>
            </tfoot>
          </table>

          <div className="flex justify-between mt-4">
            <div className="w-1/2">
              <div className="mb-4 p-4 border rounded">
                <h3 className="font-semibold mb-2">BANK DETAILS</h3>
                <p className="text-sm">Bank Name: {formData.bankName}</p>
                <p className="text-sm">IFSC: {formData.ifsc}</p>
                <p className="text-sm">Account No: {formData.accountNo}</p>
                <p className="text-sm">Branch: {formData.branch}</p>
              </div>
              <div className="p-4 border rounded">
                <h3 className="font-semibold mb-2">PAYMENT QR CODE</h3>
                <p className="text-sm">UPI ID: {formData.upiId}</p>
              </div>
            </div>
            <div className="w-1/2">
              <table className="w-full mb-4">
                <tbody>
                  <tr>
                    <td className="py-1 text-right">TAXABLE AMOUNT</td>
                    <td className="py-1 text-right">{formData.taxableAmount}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-right">CGST @9%</td>
                    <td className="py-1 text-right">{formData.cgst}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-right">SGST @9%</td>
                    <td className="py-1 text-right">{formData.sgst}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-right">Freight</td>
                    <td className="py-1 text-right">{formData.freight}</td>
                  </tr>
                  <tr className="font-semibold">
                    <td className="py-1 text-right">TOTAL AMOUNT</td>
                    <td className="py-1 text-right">
                      {parseFloat(calculateSubtotal()) + parseFloat(formData.cgst || 0) + parseFloat(formData.sgst || 0) + parseFloat(formData.freight || 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="text-right mb-8">
                <p className="text-sm">Total Amount (in words):</p>
                <p className="text-sm">{formData.amountInWords}</p>
              </div>
              <div className="text-right">
                <img
                  src={formData.signature}
                  alt="Signature"
                  className="inline-block mb-2 max-h-16"
                />
                <p className="text-sm">
                  Authorised Signature for
                  <br />
                  {companyDetails.name}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Print Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default Invoice;