interface Props {
  crashedAt: number;
}

const Finished: React.FC<Props> = ({ crashedAt }) => {
  return (
    <div className="flex flex-col items-center text-crash">
      <p className="text-4xl">Game crashed at :</p>
      <p className="text-7xl">{`x${(crashedAt / 100).toFixed(2)}`}</p>
    </div>
  );
};

export default Finished;
