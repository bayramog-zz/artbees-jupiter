<?php
/**
 * This class handles the Compatibility component.
 *
 * @package JupiterX\Framework\API\Compatibility
 *
 * @since 1.0.0
 */

/**
 * The Compatibility component.
 *
 * @since   1.0.0
 * @ignore
 * @access  private
 *
 * @package JupiterX\Framework\API\Compatibility
 */
final class _JupiterX_Compatibility {

	/**
	 * Versions update functions.
	 *
	 * @var array
	 */
	private $updates = [
		'1.0.2'  => 'jupiterx_update_v102',
		'1.3.0'  => 'jupiterx_update_v130',
		'1.11.0' => 'jupiterx_update_v1110',
	];

	/**
	 * Current Jupiter version saved from database.
	 *
	 * @var string
	 */
	private $current_version = '';

	/**
	 * Class constructor.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function __construct() {
		$this->version_check();
	}

	/**
	 * Run version compare.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function version_check() {
		$this->current_version = jupiterx_get_option( 'theme_version', null );

		// Short circuit.
		if ( version_compare( JUPITERX_VERSION, $this->current_version, '==' ) ) {
			return;
		}

		// Get version from deprecated option storage.
		if ( is_null( $this->current_version ) ) {
			$prev_version = get_option( 'jupiterx_theme_version', null );

			if ( $prev_version ) {
				$this->current_version = $prev_version;
				delete_option( 'jupiterx_theme_version' );
			} elseif ( get_option( 'jupiterx_theme_current_version' ) ) {
				// Since version 1.5.0, the compatibility updater class had a bug that stop updating the `jupiterx_theme_version` option.
				// This would be a starting point for our updater to run functions it needs when user starts updating their theme greater
				// than 1.7.0 version. This code block will only run when the user installed the theme on version >= 1.5.0 and <= 1.7.0.
				$this->current_version = '1.5.0';
				delete_option( 'jupiterx_theme_current_version' );
			}
		}

		// Empty value considered as a fresh installed theme.
		if ( is_null( $this->current_version ) || empty( $this->current_version ) ) {
			$this->update_version();
			return;
		}

		if ( version_compare( JUPITERX_VERSION, $this->current_version, '>' ) ) {
			$this->run_updates();
		}
	}

	/**
	 * Update version from the database.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	private function update_version() {
		jupiterx_update_option( 'theme_version', JUPITERX_VERSION );
	}

	/**
	 * Run updates.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	private function run_updates() {
		// Run updates.
		foreach ( $this->updates as $version => $function ) {
			if ( version_compare( $version, $this->current_version, '>' ) ) {
				call_user_func( $function );
			}
		}

		// Safe to update version.
		$this->update_version();
	}
}

new _JupiterX_Compatibility();
