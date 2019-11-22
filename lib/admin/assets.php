<?php
/**
 * Manage admin assets.
 *
 * @package JupiterX\Framework\Admin
 *
 * @since 1.3.0
 */

jupiterx_add_smart_action( 'admin_enqueue_scripts', 'jupiterx_enqueue_admin_scripts' );
/**
 * Enqueue admin scripts.
 *
 * @since 1.3.0
 */
function jupiterx_enqueue_admin_scripts() {
	wp_enqueue_style( 'jupiterx-admin-icons', JUPITERX_ASSETS_URL . 'dist/css/icons-admin.css', [], JUPITERX_VERSION );
	wp_enqueue_style( 'jupiterx-common', JUPITERX_ASSETS_URL . 'dist/css/common' . JUPITERX_MIN_CSS . '.css', [], JUPITERX_VERSION );

	if ( jupiterx_is_screen( 'widgets' ) ) {
		wp_enqueue_script( 'wp-color-picker-alpha', JUPITERX_ASSETS_URL . 'dist/js/wp-color-picker-alpha' . JUPITERX_MIN_JS . '.js', [ 'wp-color-picker' ], JUPITERX_VERSION, true );
		wp_enqueue_script( 'jupiterx-modal', JUPITERX_ASSETS_URL . 'dist/js/jupiterx-modal' . JUPITERX_MIN_JS . '.js', [], JUPITERX_VERSION, true );
		wp_enqueue_script( 'jupiterx-gsap', JUPITERX_CONTROL_PANEL_ASSETS_URL . 'lib/gsap/gsap' . JUPITERX_MIN_JS . '.js', [], '1.19.1', true );
		wp_enqueue_style( 'jupiterx-modal', JUPITERX_ASSETS_URL . 'dist/css/jupiterx-modal' . JUPITERX_MIN_CSS . '.css', [], JUPITERX_VERSION );
	}

	wp_enqueue_script( 'jupiterx-common', JUPITERX_ASSETS_URL . 'dist/js/common' . JUPITERX_MIN_JS . '.js', [ 'jquery', 'wp-util', 'updates' ], JUPITERX_VERSION, true );
	wp_localize_script(
		'jupiterx-common',
		'jupiterxUtils',
		[
			'proBadge'    => jupiterx_get_pro_badge(),
			'proBadgeUrl' => jupiterx_get_pro_badge_url(),
			'helpLinks'   => jupiterx_is_help_links(),
		]
	);
	wp_localize_script(
		'jupiterx-common',
		'jupiterx_admin_textdomain',
		[
			'add_custom_sidebar_modal_title' => __( 'Add New Custom Sidebar', 'jupiterx-lite' ),
			'add_custom_sidebar'             => __( 'Add Custom Sidebar', 'jupiterx-lite' ),
			'delete_custom_sidebar'          => __( 'Delete Custom Sidebar', 'jupiterx-lite' ),
			'deleting'                       => __( 'Deleting', 'jupiterx-lite' ),
		]
	);
}

jupiterx_add_smart_action( 'admin_print_footer_scripts', 'jupiterx_print_admin_templates' );
jupiterx_add_smart_action( 'jupiterx_print_templates', 'jupiterx_print_admin_templates' );
/**
 * Print admin JS templates.
 *
 * @since 1.3.0
 */
function jupiterx_print_admin_templates() {
	?>
	
	<script type="text/html" id="tmpl-jupiterx-progress-bar">
		<div class="progress">
			<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 20%"></div>
		</div>
	</script>
	
	<?php
}

add_action( 'admin_init', 'jupiterx_admin_scripts' );
/**
 * Register admin scripts.
 *
 * @since 1.11.0
 */
function jupiterx_admin_scripts() {
	wp_register_style( 'jupiterx-templates', JUPITERX_ASSETS_URL . 'dist/css/templates' . JUPITERX_MIN_CSS . '.css', [ 'jupiterx-modal' ], JUPITERX_VERSION );
	wp_register_script( 'jupiterx-templates', JUPITERX_ASSETS_URL . 'dist/js/templates' . JUPITERX_MIN_JS . '.js', [ 'jquery', 'underscore', 'jupiterx-modal' ], JUPITERX_VERSION, true );
	wp_localize_script( 'jupiterx-templates', 'jupiterxTemplates', [
		'siteUrl'           => home_url(),
		'adminAjaxUrl'      => admin_url( 'admin-ajax.php' ),
		'proBadgeUrl'       => jupiterx_get_pro_badge_url(),
		'isPremium'         => jupiterx_is_premium(),
		'upgradeLink'       => esc_url( jupiterx_upgrade_link( 'templates' ) ),
		'template'          => jupiterx_get_option( 'template_installed_id', null ),
		'api'               => 'https://themes.artbees.net/wp-json/templates/v1',
		'i18n'              => [
			'all'                   => __( 'All', 'jupiterx-lite' ),
			'empty'                 => __( 'No template found.', 'jupiterx-lite' ),
			'emptyInfo'             => __( 'Clear some filters and try again.', 'jupiterx-lite' ),
			'loadMore'              => __( 'Load More', 'jupiterx-lite' ),
			'import'                => __( 'Import', 'jupiterx-lite' ),
			'preview'               => __( 'Preview', 'jupiterx-lite' ),
			'confirm'               => __( 'Confirm', 'jupiterx-lite' ),
			'cancel'                => __( 'Cancel', 'jupiterx-lite' ),
			'discard'               => __( 'Discard', 'jupiterx-lite' ),
			'install'               => __( 'Install', 'jupiterx-lite' ),
			'yes'                   => __( 'Yes', 'jupiterx-lite' ),
			'askContinue'           => __( 'Are you sure to continue?', 'jupiterx-lite' ),
			'installTitle'          => __( 'Important Notice', 'jupiterx-lite' ),
			'installText'           => __( 'You are about to install <strong>{template}</strong> template. Installing a new template will remove all current data on your website. Are you sure you want to proceed?', 'jupiterx-lite' ),
			'mediaTitle'            => __( 'Include Images and Videos?', 'jupiterx-lite' ),
			'mediaText'             => sprintf(
				/* translators: Learn more URL */
				__( 'Would you like to import images and videos as preview? <br> Notice that all images are <strong>strictly copyrighted</strong> and you need to acquire the license in case you want to use them on your project. <a href="%s" target="_blank">Learn More</a>', 'jupiterx-lite' ),
				'https://help.artbees.net/getting-started/installing-a-template'
			),
			'mediaConfirm'          => __( 'Do not include', 'jupiterx-lite' ),
			'mediaCancel'           => __( 'Include', 'jupiterx-lite' ),
			'progressTitle'         => __( 'Installing in progress...', 'jupiterx-lite' ),
			'progressBackup'        => __( 'Backup database', 'jupiterx-lite' ),
			'progressPackage'       => __( 'Downloading package', 'jupiterx-lite' ),
			'progressPlugins'       => __( 'Install required plugins', 'jupiterx-lite' ),
			'progressInstall'       => __( 'Installing in progress...', 'jupiterx-lite' ),
			'completedTitle'        => __( 'All Done!', 'jupiterx-lite' ),
			'completedText'         => __( 'Template is successfully installed.', 'jupiterx-lite' ),
			'errorTitle'            => __( 'Something went wrong!', 'jupiterx-lite' ),
			'errorText'             => __( 'There is an error while installing the template, please contact support.', 'jupiterx-lite' ),
			'customTitle'           => __( 'Choose how you want to import this template:', 'jupiterx-lite' ),
			'customMediaText'       => __( 'Include media (Copyrighted).', 'jupiterx-lite' ),
			'completeImportTitle'   => __( 'Full import ', 'jupiterx-lite' ),
			'completeImportText'    => __( 'Your current content, settings, widgets, etc. will be removed and the database will be reset. New page contents and settings will be replaced.', 'jupiterx-lite' ),
			'completeImportWarning' => __( 'All your current content, settings, widgets, etc. will be removed and the new content will be replaced.', 'jupiterx-lite' ),
			'partialImportTitle'    => __( 'Content import', 'jupiterx-lite' ),
			'partialImportText'     => __( 'Keep your current content, settings, widgets, etc. Only the new page contents will be imported.', 'jupiterx-lite' ),
		],
	] );
}
