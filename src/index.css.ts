import { Styles } from "@ijstech/components";

const Theme = Styles.Theme.ThemeVars;

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
  color: Theme.text.primary,
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
  // background: 'linear-gradient(#232B5A, #232B5A), linear-gradient(254.8deg, #E75B66 -8.08%, #B52082 84.35%)',
  backgroundOrigin: 'border-box !important',
  backgroundClip: 'content-box, border-box !important',
  borderRadius: 16
})

export const tokenSelectionStyle = Styles.style({
  $nest: {
    'i-vstack.custom-border > i-hstack': {
      display: 'none'
    },
    '#inputAmount': {
      fontSize: '1.25rem'
    },
    '#gridTokenInput': {
      height: '100%'
    },
    '.i-modal_header': {
      display: 'none'
    },
    '#gridTokenList': {
      maxHeight: '50vh',
      overflow: 'auto',
      $nest: {
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar': {
          width: '5px',
          height: '5px'
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#FF8800',
          borderRadius: '5px'
        }
      }
    },
    '#pnlSortBalance': {
      $nest: {
        '.icon-sort-up': {
          top: 1
        },
        '.icon-sort-down': {
          bottom: 1
        },
        'i-icon svg': {
          fill: 'inherit'
        }
      }
    }
  }
})