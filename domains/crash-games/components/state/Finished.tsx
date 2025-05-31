interface Props {
  crashedAt: number;
}

const Finished: React.FC<Props> = ({ crashedAt }) => {
  return (
    <>
      <p className="text-4xl" style={{ color: "#E73A38" }}>
        Game crashed at :
      </p>
      <p className="text-7xl" style={{ color: "#E73A38" }}>
        {`x${(crashedAt / 100).toFixed(2)}`}
      </p>
    </>
  );
};

export default Finished;
