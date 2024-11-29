import { Organization } from "@prisma/client";
interface outputInterface {
  organizations: Organization[];
}
const Output = ({ organizations }: outputInterface) => {
  console.log(organizations);
  
  return (
    <div className="flex-1 p-4">
      <div>
        {organizations.map((e: Organization) => (
          <div key={e.id}>
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
