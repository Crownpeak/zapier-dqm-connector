const authentication = require('./authentication');
const { befores = [], afters = [] } = require('./middleware');

const listAssets = require('./creates/list_assets');
const getAssetDetails = require('./creates/get_asset_details');
const createAsset = require('./creates/create_asset');
const deleteAsset = require('./creates/delete_asset');
const updateAsset = require('./creates/update_asset');
const getAssetContent = require('./creates/get_asset_content');
const getAssetStatus = require('./creates/get_asset_status');
const getSpellcheckIssues = require('./creates/get_spellcheck_issues');
const getAssetErrorsByCheckpoint = require('./creates/get_asset_errors_by_checkpoint');
const getAssetPageHighlights = require('./creates/get_asset_page_highlights');

const listCheckpoints = require('./searches/list_checkpoints');
const getCheckpointDetails = require('./creates/get_checkpoint_details');

const listWebsites = require('./searches/list_websites');
const getWebsiteDetails = require('./creates/get_website_details');
const getWebsiteCheckpoints = require('./searches/get_website_checkpoints');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication,

  beforeRequest: [...befores],

  afterResponse: [...afters],

  triggers: {},

  searches: {
    [listWebsites.key]: listWebsites,
    [getWebsiteCheckpoints.key]: getWebsiteCheckpoints,
    [listCheckpoints.key]: listCheckpoints
  },

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
