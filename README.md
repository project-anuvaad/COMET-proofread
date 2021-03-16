## COMET Video Proofread web component
`<vd-proofread></vd-proofread>`

This web component is part of comet.anuvaad.org and used for the proofreading stage

### Usage:

Use the web component `vd-proofread` anywhere on the page with the following properties  

`<vd-proofread apiKey="" apiRoot="" videoId="" backRoute="" finishRedirectRoute="" </vd-proofread>`
`
### Properties
- apiKey: Obtain an API key for your organization from the dashboard on comet.anuvaad.org
- apiRoot: The API to which the component will communicate, for integration with COMET's original API use https://comet.anuvaad.org.org/api
- videoId: the `_id` field of the video that is to be proofread
- backRoute: the location/route to which the component should redirect when the user press "Back to videos" button.
- finishRedirectRoute: The location/route to which the component should redirect when the user press "Save and complete" button.