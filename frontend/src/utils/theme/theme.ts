import type { theme } from './types'

export const getTextTheme = (theme: theme) => {
  switch (theme) {
    case 'primary':
      return 'text-primary-default'
    case 'secondary':
      return 'text-secondary-default'
    case 'success':
      return 'text-success-default'
    case 'danger':
      return 'text-danger-default'
    case 'warning':
      return 'text-warning-default'
    case 'normal':
      return 'text-normal-default'
    case 'white':
      return 'text-white'
    case 'black':
      return 'text-black'
  }
}

export const getTextDarkTheme = (theme: theme) => {
  switch (theme) {
    case 'primary':
      return 'text-primary-dark'
    case 'secondary':
      return 'text-secondary-dark'
    case 'success':
      return 'text-success-dark'
    case 'danger':
      return 'text-danger-dark'
    case 'warning':
      return 'text-warning-dark'
    case 'normal':
      return 'text-normal-dark'
  }
}

export const getFocusTextTheme = (theme: theme) => {
  switch (theme) {
    case 'primary':
      return 'focus:text-primary-default'
    case 'secondary':
      return 'focus:text-secondary-default'
    case 'success':
      return 'focus:text-success-default'
    case 'danger':
      return 'focus:text-danger-default'
    case 'warning':
      return 'focus:text-warning-default'
    case 'normal':
      return 'focus:text-normal-default'
  }
}

export const getBorderTheme = (theme: theme) => {
  switch (theme) {
    case 'primary':
      return 'border-primary-default hover:bg-lightPrimary-light'
    case 'secondary':
      return 'border-secondary-default hover:bg-lightSecondary-light'
    case 'success':
      return 'border-success-default hover:bg-lightSuccess-light'
    case 'danger':
      return 'border-danger-default hover:bg-lightDanger-light'
    case 'warning':
      return 'border-warning-default hover:bg-lightWarning-light'
    case 'normal':
      return 'border-normal-default hover:bg-lightNormal-light'
  }
}

export const getDirection = (direction: 'row' | 'col') => {
  return 'flex flex-' + direction
}

export const getDrakBorderBackGroundTheme = (theme: theme) => {
  switch (theme) {
    case 'primary':
      return 'border-primary-dark bg-primary-default'
    case 'secondary':
      return 'border-secondary-dark bg-secondary-default'
    case 'success':
      return 'border-success-dark bg-success-default'
    case 'danger':
      return 'border-danger-dark bg-danger-default'
    case 'warning':
      return 'border-warning-dark bg-warning-default'
    case 'normal':
      return 'border-normal-dark bg-normal-default'
    case 'white':
      return 'border-normal-default bg-white'
  }
}

export const getLightBorderBackGroundTheme = (theme: theme) => {
  switch (theme) {
    case 'primary':
      return 'border-primary-light bg-primary-default'
    case 'secondary':
      return 'border-secondary-light bg-secondary-default'
    case 'success':
      return 'border-success-light bg-success-default'
    case 'danger':
      return 'border-danger-light bg-danger-default'
    case 'warning':
      return 'border-warning-light bg-warning-default'
    case 'normal':
      return 'border-normal-light bg-normal-default'
    case 'white':
      return 'border-normal-light bg-white'
  }
}

export const getButtonBackGroundTheme = (theme: theme) => {
  switch (theme) {
    case 'primary':
      return 'bg-primary-default hover:bg-primary-dark'
    case 'secondary':
      return 'bg-secondary-default hover:bg-secondary-dark'
    case 'success':
      return 'bg-success-default hover:bg-success-dark'
    case 'danger':
      return 'bg-danger-default hover:bg-danger-dark'
    case 'warning':
      return 'bg-warning-default hover:bg-warning-dark'
    case 'normal':
      return 'bg-normal-default hover:bg-normal-dark'
  }
}

export const getFocusRingTheme = (theme: theme) => {
  switch (theme) {
    case 'primary':
      return 'focus:ring-primary-default'
    case 'secondary':
      return 'focus:ring-secondary-default'
    case 'success':
      return 'focus:ring-success-default'
    case 'danger':
      return 'focus:ring-danger-default'
    case 'warning':
      return 'focus:ring-warning-default'
    case 'normal':
      return 'focus:ring-normal-default'
  }
}

export const getLightBackGroundTheme = (theme: theme) => {
  switch (theme) {
    case 'primary':
      return 'bg-lightPrimary-light'
    case 'secondary':
      return 'bg-lightSecondary-light'
    case 'success':
      return 'bg-lightSuccess-light'
    case 'danger':
      return 'bg-lightDanger-light'
    case 'warning':
      return 'bg-lightWarning-light'
    case 'normal':
      return 'bg-lightNormal-light'
    case 'white':
      return 'bg-white'
  }
}

export const getPlaceholderTheme = (theme: theme) => {
  switch (theme) {
    case 'primary':
      return 'placeholder-primary-light'
    case 'secondary':
      return 'placeholder-secondary-light'
    case 'success':
      return 'placeholder-success-light'
    case 'danger':
      return 'placeholder-danger-light'
    case 'warning':
      return 'placeholder-warning-light'
    case 'normal':
      return 'placeholder-normal-light'
  }
}

export const getFocusPlaceholderTheme = (theme: theme) => {
  switch (theme) {
    case 'primary':
      return 'focus:placeholder-primary-light'
    case 'secondary':
      return 'focus:placeholder-secondary-light'
    case 'success':
      return 'focus:placeholder-success-light'
    case 'danger':
      return 'focus:placeholder-danger-light'
    case 'warning':
      return 'focus:placeholder-warning-light'
    case 'normal':
      return 'focus:placeholder-normal-light'
  }
}