import { Text } from 'react-native';


export default function Q25Text(props) {
  return (
    <Text
      style={[{fontFamily: 'monospace'}, props.style]}
    >
      {props.children}
    </Text>
  );
};
