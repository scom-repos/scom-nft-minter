import { Styles } from "@ijstech/components";

const Theme = Styles.Theme.ThemeVars;
// Styles.Theme.defaultTheme.background.modal = "#fff";
// Styles.Theme.applyTheme(Styles.Theme.defaultTheme);

export const imageStyle = Styles.style({
  $nest: {
    '&>img': {
      maxWidth: 'unset',
      maxHeight: 'unset',
      borderRadius: 4
    }
  }
})

export const markdownStyle = Styles.style({
  overflowWrap: 'break-word'
})

export const inputStyle = Styles.style({
  $nest: {
    '> input': {
      background: 'transparent',
      border: 0,
      padding: '0.25rem 0.5rem',
      textAlign: 'right',
      color: Theme.input.fontColor
    }
  }
})


export const inputGroupStyle = Styles.style({
  border: '2px solid transparent',
  background: 'linear-gradient(#232B5A, #232B5A), linear-gradient(254.8deg, #E75B66 -8.08%, #B52082 84.35%)',
  backgroundOrigin: 'border-box !important',
  backgroundClip: 'content-box, border-box !important',
  borderRadius: 16
})

export const tokenSelectionStyle = Styles.style({
  $nest: {
    'i-button.token-button': {
      justifyContent: 'start'
    }
  }
})