<?php
/**
 * Handles TGMPA functionalities.
 *
 * @since 1.5.0
 *
 * @package Jupiter\Framework\Admin\TGMPA
 */

add_action( 'tgmpa_register', 'jupiterx_register_tgmpa_plugins' );
/**
 * Register the required plugins.
 *
 * @since 1.5.0
 *
 * @SuppressWarnings(PHPMD.ElseExpression)
 */
function jupiterx_register_tgmpa_plugins() {
	if ( ! jupiterx_is_premium() ) :
		$free_plugins = [
			[
				'name' => __( 'Jupiter X Core', 'jupiterx-lite' ),
				'slug' => 'jupiterx-core',
				'required' => false,
				'force_activation' => false,
				'force_deactivation' => false,
			],
			[
				'name' => __( 'Elementor', 'jupiterx-lite' ),
				'slug' => 'elementor',
				'required' => false,
				'force_activation' => false,
				'force_deactivation' => false,
			],
			[
				'name' => __( 'Advanced Custom Fields', 'jupiterx-lite' ),
				'slug' => 'advanced-custom-fields',
				'required' => false,
				'force_activation' => false,
				'force_deactivation' => false,
			],
			[
				'name' => __( 'Lazy Load', 'jupiterx-lite' ),
				'slug' => 'lazy-load',
				'required' => false,
				'force_activation' => false,
				'force_deactivation' => false,
				'label_type' => __( 'Optional', 'jupiterx-lite' ),
			],
			[
				'name' => __( 'Woocommerce', 'jupiterx-lite' ),
				'slug' => 'woocommerce',
				'required' => false,
				'force_activation' => false,
				'force_deactivation' => false,
				'label_type' => __( 'Optional', 'jupiterx-lite' ),
			],
			[
				'name' => __( 'Menu Icons by ThemeIsle', 'jupiterx-lite' ),
				'slug' => 'menu-icons',
				'required' => false,
				'force_activation' => false,
				'force_deactivation' => false,
				'label_type' => __( 'Optional', 'jupiterx-lite' ),
			],
		];

		$plugins = apply_filters( 'jupiterx_tgmpa_plugins', $free_plugins );
	endif;

	$config = [
		'id'           => 'jupiterx',
		'default_path' => '',
		'menu'         => 'tgmpa-install-plugins',
		'has_notices'  => true,
		'dismissable'  => true,
		'dismiss_msg'  => '',
		'is_automatic' => false,
		'message'      => '',
	];

	tgmpa( $plugins, $config );
}

add_filter( 'tgmpa_plugin_action_links', 'jupiterx_tgmpa_go_pro_link' );
add_filter( 'tgmpa_network_admin_plugin_action_links', 'jupiterx_tgmpa_go_pro_link' );
/**
 * Change go pro action links in TGMPA.
 *
 * @param array $action_links List of action links.
 *
 * @since 1.10.0
 *
 * @return array $action_links Modified list of action links.
 */
function jupiterx_tgmpa_go_pro_link( $action_links ) {
	if ( isset( $action_links['pro'] ) ) {
		$action_links['pro'] = '<a href="' . esc_url( jupiterx_upgrade_link( 'plugins' ) ) . '" class="jupiterx-tgmpa-pro-plugin-action-link" target="_blank">' . __( 'Go Pro', 'jupiterx-lite' ) . '<span class="screen-reader-text">' . __( 'Buy Jupiter X', 'jupiterx-lite' ) . '</span></a>';
	}

	return $action_links;
}
