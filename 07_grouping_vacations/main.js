const fs = require("fs/promises");

async function getDevelopersVacations() {
  const json = await fs.readFile("vacations.json", "utf-8");
  return json;
}

async function groupData() {
  try {
    const originalData = await getDevelopersVacations();
    const jsonData = JSON.parse(originalData);

    const groupedData = jsonData.reduce((acc, { user, startDate, endDate }) => {
      const { _id, name } = user;
      if (!acc[_id]) {
        acc[_id] = {
          userId: _id,
          userName: name,
          vacations: [],
        };
      }

      acc[_id].vacations.push({
        startDate,
        endDate,
      });

      return acc;
    }, {});

    const result = Object.values(groupedData);

    console.log(result)

    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
groupData()