export type ChildRecord = {
  id: string;
  name: string;
  recordId: string;
  birthDate: Date | null;
  gender: "Male" | "Female" | "Other";
  hearingLoss: "Yes" | "No";
  address: string;
  contactNumber: string;
};

export const records: ChildRecord[] = [
  {
    id: "1",
    name: "Priya Patel",
    recordId: "1246467",
    birthDate: new Date(),
    gender: "Female",
    hearingLoss: "Yes",
    address: "Mumbai",
    contactNumber: "1234567890",
  },
  {
    id: "2",
    name: "Vijay Agvanti",
    recordId: "1242367",
    birthDate: new Date(),
    gender: "Male",
    hearingLoss: "No",
    address: "Pune",
    contactNumber: "1234567890",
  },
  {
    id: "3",
    name: "Shiva Ram Sundray",
    recordId: "1246687",
    birthDate: new Date(),
    gender: "Male",
    hearingLoss: "Yes",
    address: "Mumbai",
    contactNumber: "1234567890",
  },
  {
    id: "4",
    name: "Korilav Ranga",
    recordId: "1248874",
    birthDate: new Date(),
    gender: "Male",
    hearingLoss: "Yes",
    address: "Mumbai",
    contactNumber: "1234567890",
  },
  {
    id: "5",
    name: "Sourabh Sudhir",
    recordId: "1647797",
    birthDate: new Date(),
    gender: "Male",
    hearingLoss: "Yes",
    address: "Mumbai",
    contactNumber: "1234567890",
  },
  {
    id: "6",
    name: "Rajesh Kumar",
    recordId: "1247797",
    birthDate: new Date(),
    gender: "Male",
    hearingLoss: "Yes",
    address: "Mumbai",
    contactNumber: "1234567890",
  },
  {
    id: "7",
    name: "Dinesh Kumar",
    recordId: "1347797",
    birthDate: new Date(),
    gender: "Male",
    hearingLoss: "Yes",
    address: "Mumbai",
    contactNumber: "1234567890",
  },
];
