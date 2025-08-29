const authentication = require('./authentication');
const { befores = [], afters = [] } = require('./middleware');

// Create Actions
const listAssets = require('./creates/list_assets');
const getWebsiteDetails = require('./creates/get_website_details');
const getCheckpointDetails = require('./creates/get_checkpoint_details');
const getAssetDetails = require('./creates/get_asset_details');
const createAsset = require('./creates/create_asset');
const deleteAsset = require('./creates/delete_asset');
const updateAsset = require('./creates/update_asset');
const getAssetContent = require('./creates/get_asset_content');
const getAssetStatus = require('./creates/get_asset_status');
const getSpellcheckIssues = require('./creates/get_spellcheck_issues');
const getAssetErrorsByCheckpoint = require('./creates/get_asset_errors_by_checkpoint');
const getAssetPageHighlights = require('./creates/get_asset_page_highlights');

// Search Actions
const listWebsites = require('./searches/list_websites');
const getWebsiteCheckpoints = require('./searches/get_website_checkpoints');
const listCheckpoints = require('./searches/list_checkpoints');

module.exports = {
  // This is just shorthand to reference the installed dependencies you have.
  // Zapier will need to know these before we can upload.
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication,

  beforeRequest: [...befores],

  afterResponse: [...afters],

  // If you want your trigger to show up, you better include it here!
  triggers: {},

  // If you want your searches to show up, you better include it here!
  searches: {
    [listWebsites.key]: listWebsites,
    [getWebsiteCheckpoints.key]: getWebsiteCheckpoints,
    [listCheckpoints.key]: listCheckpoints
  },

  // If you want your creates to show up, you better include it here!
  creates: {
    [listAssets.key]: listAssets,
    [getWebsiteDetails.key]: getWebsiteDetails,
    [getCheckpointDetails.key]: getCheckpointDetails,
    [getAssetDetails.key]: getAssetDetails,
    [createAsset.key]: createAsset,
    [deleteAsset.key]: deleteAsset,
    [updateAsset.key]: updateAsset,
    [getAssetContent.key]: getAssetContent,
    [getAssetStatus.key]: getAssetStatus,
    [getSpellcheckIssues.key]: getSpellcheckIssues,
    [getAssetErrorsByCheckpoint.key]: getAssetErrorsByCheckpoint,
    [getAssetPageHighlights.key]: getAssetPageHighlights
  },

  resources: {},
};
