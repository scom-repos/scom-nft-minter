import { Styles } from "@ijstech/components";

const Theme = Styles.Theme.ThemeVars;

export const markdownStyle = Styles.style({
  color: Theme.text.primary,
  overflowWrap: 'break-word'
})

export const inputStyle = Styles.style({
  $nest: {
    '> input': {
      textAlign: 'right'
    }
  }
})

export const tokenSelectionStyle = Styles.style({
  $nest: {
    // '.i-modal_header': {
    //   display: 'none'
    // },
    '#gridTokenList': {
      // maxHeight: '50vh',
      // overflow: 'auto',
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
    // '#pnlSortBalance': {
    //   $nest: {
    //     '.icon-sort-up': {
    //       top: 1
    //     },
    //     '.icon-sort-down': {
    //       bottom: 1
    //     },
    //     'i-icon svg': {
    //       fill: 'inherit'
    //     }
    //   }
    // }
  }
})

export const linkStyle = Styles.style({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: 'block',
  cursor: 'pointer',
  $nest: {
    '*': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      width: '100%',
    },
  }
})

export const formInputStyle = Styles.style({
  width: '100% !important',
  $nest: {
    '& > input': {
      height: '100% !important',
      width: '100% !important',
      maxWidth: '100%',
      padding: '0.5rem 1rem',
      color: Theme.input.fontColor,
      backgroundColor: Theme.input.background,
      borderColor: Theme.input.background,
      borderRadius: '0.625rem',
      outline: 'none'
    }
  }
})

export const comboBoxStyle = Styles.style({
  width: '100% !important',
  height: 42,
  $nest: {
    '.selection': {
      width: '100% !important',
      maxWidth: '100%',
      padding: '0.5rem 1rem',
      color: Theme.input.fontColor,
      backgroundColor: Theme.input.background,
      borderColor: Theme.input.background,
      borderRadius: '0.625rem!important',
    },

    '.selection input': {
      color: 'inherit',
      backgroundColor: 'inherit',
      padding: 0
    },
    '> .icon-btn': {
      justifyContent: 'center',
      borderColor: Theme.input.background,
      borderRadius: '0.625rem',
      width: '42px'
    }
  }
})

export const readOnlyStyle = Styles.style({
  opacity: 0.65,
  cursor: 'default',
  $nest: {
    '*': {
      cursor: 'default'
    },
    '.btn-cb-network': {
      borderColor: 'transparent !important',
      background: Theme.action.disabledBackground
    },
    'i-icon': {
      display: 'none'
    },
    '.icon-btn': {
      display: 'none'
    },
    '.selection': {
      borderRadius: 'inherit !important',
      maxWidth: '100%'
    },
  }
})

export const readOnlyInfoStyle = Styles.style({
  $nest: {
    '&> i-panel > i-stack > :last-child': {
      opacity: 0.7
    }
  }
})