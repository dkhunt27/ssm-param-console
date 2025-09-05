
# SSM Param Console

This aims to make managing settings/configuration in AWS SSM Parameter Store easier using the built in path support.  

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-toolpad-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Uses the following libraries:

- React
- React Query
- React Hook Form
- Mui
- Mui toolpad
- Jotai

## Setup

This uses AWS SDK v3.  Set up your aws credentials accordingly.  See [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html).

Install app via `yarn install`

## Getting Started

First, run the development server: `yarn dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing/Debugging Notes

### API

```bash
curl --request POST \
  --header "Content-Type: application/json" \
  --data '{"startingPath":"/some/path"}' \
  http://localhost:3000/api/ssm/get
```

## Inspiration

Derived a lot from [smblee/parameter-store-manager](https://github.com/smblee/parameter-store-manager).  Was having issues getting electron to work so converted to next/react and updated mui.
