const express = require('express');
const searchController = require('../controllers/search.controller');

const router = express.Router();

router.route('/openings')
  .get(searchController.searchOpenings);

router.route('/players')
  .get(searchController.searchPlayers);

router.route('/eco')
  .get(searchController.searchEco);

router.route('/autocomplete')
  .get(searchController.getAutocomplete);

router.route('/fuzzy')
  .get(searchController.searchFuzzy);

module.exports = router;
