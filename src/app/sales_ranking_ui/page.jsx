import axios from "axios";
import VendedorForm from './vendedorForm';
import RankingTable from './rankingTable';

function NewPage() {
  return (
    <div className="h-5/6 grid place-items-center">
      <RankingTable/>
    </div>
  );
}
export default NewPage;

export const getServerSideProps = async (context) => {
  const res = await axios.get("http://localhost:3000/api/ranking");

  return {
    props: {
      ranking: res.data,
    },
  };
};
