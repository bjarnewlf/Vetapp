import { StyleSheet } from 'react-native';
import { fonts } from './fonts';

export const typography = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontFamily: fonts.heading.bold,
    lineHeight: 34,
  },
  h2: {
    fontSize: 22,
    fontFamily: fonts.heading.bold,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontFamily: fonts.heading.semiBold,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontFamily: fonts.body.regular,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 14,
    fontFamily: fonts.body.regular,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontFamily: fonts.body.regular,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontFamily: fonts.body.semiBold,
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.body.semiBold,
    lineHeight: 20,
  },
  sectionHeader: {
    fontSize: 13,
    fontFamily: fonts.body.semiBold,
    lineHeight: 18,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  stat: {
    fontSize: 24,
    fontFamily: fonts.heading.bold,
    lineHeight: 30,
  },
  display: {
    fontSize: 38,
    fontFamily: fonts.heading.bold,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  displaySmall: {
    fontSize: 28,
    fontFamily: fonts.heading.bold,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
});
