import Error from 'next/error';

const CustomErrorComponent = (props: { statusCode: number }) => {
  return <Error statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData: any) => {
  return Error.getInitialProps(contextData);
};

export default CustomErrorComponent;
