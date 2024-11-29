import { Organization } from "@prisma/client";
interface outputInterface {
  organizations: Organization[];
}
const Output = ({ organizations }: outputInterface) => {
  console.log(organizations);
  
  return (
    <div className="flex-1 p-4">
      <div className="grid grid-cols-3 gap-x-3 ">
        {organizations.map((e: Organization) => (
          <div key={e.id} className="bg-gray-400 p-5">
            <div>
              <p> {e.name}</p>
              <p>{e.username}</p>
              <p></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Output;
