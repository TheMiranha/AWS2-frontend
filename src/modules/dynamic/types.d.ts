export type Service = 'ecr'

export type Listener = {
  service: Service
  fn: (e: Dynamics) => void
}

export type PullImageDynamic = {
  service: 'ecr',
  action: 'pullImage',
  image: string
}

export type Dynamics = PullImageDynamic