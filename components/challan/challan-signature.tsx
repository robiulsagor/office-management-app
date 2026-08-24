export default function ChallanSignature() {
  return (
    <table width={700} className="mx-auto mt-16 border-collapse">
      <tbody>
        <tr>
          <td className="h-28 w-1/2 text-center align-bottom pb-3">
            <span className="border-t border-black px-2">
                Received By
            </span>
          </td>

          <td className="h-28 w-1/2 text-center align-bottom pb-3">
            <span className="border-t border-black px-2">
                Authorized Sign
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
}