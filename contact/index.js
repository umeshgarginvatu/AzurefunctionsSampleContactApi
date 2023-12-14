let sampleData = [];

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  switch (req.method) {
    case "GET":
      // Read operation: Return all sample data or send 'No data found' message
      if (sampleData.length === 0) {
        context.res = {
          status: 404, // 404 Not Found
          body: "No data found",
        };
        break;
      }

      const requestedId = req.query.id;
      if (requestedId) {
        // If ID is provided in query params, find and return the specific contact
        const requestedContact = sampleData.find(
          (contact) => contact.id === parseInt(requestedId)
        );
        if (requestedContact) {
          context.res = {
            body: requestedContact,
          };
        } else {
          context.res = {
            status: 404, // 404 Not Found
            body: "Contact not found",
          };
        }
      } else {
        // If no ID is provided, return all contacts
        context.res = {
          body: sampleData,
        };
      }
      break;

    case "POST":
      const newData = req.body;
      const newId = generateId(); // Function to generate a unique ID
      newData.id = newId; // Assign the generated ID to the new data
      sampleData.push(newData);
      context.res = {
        status: 201,
        body: newData,
      };
      break;
    case "PUT":
      // Update operation: Update existing data based on ID from query string
      const updateId = req.query.id; // Assuming ID is passed in query string
      const updatedData = req.body;
      const existingDataIndex = sampleData.findIndex(
        (item) => item.id === parseInt(updateId)
      );
      if (existingDataIndex !== -1) {
        updatedData.id = parseInt(updateId); // Ensure the ID remains the same
        sampleData[existingDataIndex] = updatedData;
        context.res = {
          body: updatedData,
        };
      } else {
        context.res = {
          status: 400, // 400 Bad Request
          body: "Invalid ID provided for update",
        };
      }
      break;
    case "PATCH":
      // Update specific fields of existing data based on ID from query string
      const patchId = req.query.id; // Assuming ID is passed in query string
      const patchData = req.body;
      const dataIndex = sampleData.findIndex(
        (item) => item.id === parseInt(patchId)
      );
      if (dataIndex !== -1) {
        // Merge the existing data with the patch data
        sampleData[dataIndex] = { ...sampleData[dataIndex], ...patchData };
        context.res = {
          body: sampleData[dataIndex],
        };
      } else {
        context.res = {
          status: 400,
          body: "Invalid ID provided for patch",
        };
      }
      break;

    case "DELETE":
      const deleteId = req.query.id; // Assuming ID is passed in query string
      const deleteIndex = sampleData.findIndex(
        (item) => item.id === parseInt(deleteId)
      );
      if (deleteIndex !== -1) {
        const deletedItem = sampleData.splice(deleteIndex, 1);
        context.res = {
          body: deletedItem,
        };
      } else {
        context.res = {
          status: 400, // 400 Bad Request
          body: "Invalid ID provided for delete",
        };
      }
      break;
    default:
      context.res = {
        status: 400,
        body: "Please pass a valid HTTP method (GET, POST, PUT, PATCH, DELETE)",
      };
      break;
  }
};

function generateId() {
  // This is a basic example using a timestamp for simplicity.
  // In a real scenario, you might want to use UUID or a more robust method.
  return Date.now(); // Returns a unique timestamp as ID
}
