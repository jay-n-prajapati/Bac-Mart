import ButtonComponent from "./ButtonComponent";

const Table = ({ data, headers, handleUpdate, handleDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left">No.</th>
            {headers.map((header) => (
              <th key={header.key} className="border px-4 py-2 text-left">
                {header.label}
              </th>
            ))}
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
              <td className="border px-4 py-2">{index + 1}</td>
              {headers.map((header) => (
                <td key={header.key} className="border px-4 py-2">
                  {item[header.key]}
                </td>
              ))}
              <td className="border px-4 py-2 flex justify-center items-center gap-2">
                <ButtonComponent
                  onClick={() => handleUpdate(item.id)}
                  buttonStyle="px-[8px] py-[4px] text-sm mt-[0px!important]"
                >
                  Update
                </ButtonComponent>
                <ButtonComponent
                  onClick={() => handleDelete(item.id)}
                  buttonStyle="px-[8px] py-[4px] text-sm bg-[#c53030] border-[#c53030] mt-[0px!important] hover:text-[#c53030]"
                >
                  Delete
                </ButtonComponent>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
