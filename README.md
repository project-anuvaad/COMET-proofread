## Videowiki Proofread web component
`<vw-proofread></vw-proofread>`

This web component is part of www.videowiki.org and used for the proofreading stage

### Usage:
##### Include the following script in you page
`<script src="https://videowiki-microapps.s3-eu-west-1.amazonaws.com/vw-proofread/v1.0.0.js" async />`

Use the web component `vw-proofread` anywhere on the page with the following properties  

`<vw-proofread apiKey="" apiRoot="" videoId="" backRoute="" finishRedirectRoute="" </vw-proofread>`
`
### Properties
- apiKey: Obtain an API key for your organization from the dashboard on www.videowiki.org
- apiRoot: The API to which the component will communicate, for integration with videowiki's original API use https://api.videowiki.org/api
- videoId: the `_id` field of the video that is to be proofread
- backRoute: the location/route to which the component should redirect when the user press "Back to videos" button.
- finishRedirectRoute: The location/route to which the component should redirect when the user press "Save and complete" button.