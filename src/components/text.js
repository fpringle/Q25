import { StyleSheet, Text } from 'react-native';


export default function Q25Text(props) {
  return (
    <Text
      style={[styles.text, props.style]}
    >
      {props.children}
    </Text>
  );
};


const styles = StyleSheet.create({
  text: {
    fontFamily: 'monospace',
  },
});
