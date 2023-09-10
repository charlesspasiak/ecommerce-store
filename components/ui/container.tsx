interface Props {
  children: React.ReactNode;
}

const Container = ({ children }: Props) => {
  return <div className="mx-auto max-w-7xl">{children}</div>;
};
export default Container;
