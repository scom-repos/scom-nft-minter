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