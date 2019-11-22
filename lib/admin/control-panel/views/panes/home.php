<?php
if ( ! JUPITERX_CONTROL_PANEL_HOME ) {
	return;
}

$api_key = jupiterx_get_option( 'api_key' );
$is_apikey = empty( $api_key ) ? false : true;
$has_api_key = empty( $api_key ) ? 'd-none' : '';
$no_api_key = empty( $has_api_key ) ? 'd-none' : '';
?>
<div class="jupiterx-cp-pane-box" id="jupiterx-cp-home">
	<?php

	if ( ! jupiterx_is_premium() ) : ?>
		<div class="jupiterx-pro-banner">
			<i class="jupiterx-icon-pro"></i>
			<h1><?php esc_html_e( 'Upgrade to Jupiter X Pro', 'jupiterx-lite' ); ?></h1>
			<a href="<?php echo esc_attr( jupiterx_upgrade_link( 'banner' ) ); ?>" target="_blank" class="btn btn-primary"><?php esc_html_e( 'Upgrade Now', 'jupiterx-lite' ); ?></a>
			<div class="features">
				<ul>
					<li>
						<i class="jupiterx-icon-check-solid"></i>
						<span><?php esc_html_e( 'Shop customizer', 'jupiterx-lite' ); ?></span>
					</li>
					<li>
						<i class="jupiterx-icon-check-solid"></i>
						<span><?php esc_html_e( 'Custom Header and Footer', 'jupiterx-lite' ); ?></span>
					</li>
					<li>
						<i class="jupiterx-icon-check-solid"></i>
						<span><?php esc_html_e( 'Blog and Portfolio customizer', 'jupiterx-lite' ); ?></span>
					</li>
					<li>
						<i class="jupiterx-icon-check-solid"></i>
						<span><?php esc_html_e( 'Premium plugins', 'jupiterx-lite' ); ?></span>
					</li>
				</ul>
				<ul>
					<li>
						<i class="jupiterx-icon-check-solid"></i>
						<span><?php esc_html_e( 'More elementor elements', 'jupiterx-lite' ); ?></span>
					</li>
					<li>
						<i class="jupiterx-icon-check-solid"></i>
						<span><?php esc_html_e( 'Block and page templates', 'jupiterx-lite' ); ?></span>
					</li>
					<li>
						<i class="jupiterx-icon-check-solid"></i>
						<span><?php esc_html_e( 'Premium support', 'jupiterx-lite' ); ?></span>
					</li>
					<li>
						<i class="jupiterx-icon-check-solid"></i>
						<span><?php esc_html_e( '150+ pre-made website templates', 'jupiterx-lite' ); ?></span>
					</li>
				</ul>
				<ul>
					<li>
						<i class="jupiterx-icon-check-solid"></i>
						<span><?php esc_html_e( 'Premium Slideshows', 'jupiterx-lite' ); ?></span>
					</li>
					<li>
						<i class="jupiterx-icon-check-solid"></i>
						<span><?php esc_html_e( 'Adobe fonts', 'jupiterx-lite' ); ?></span>
					</li>
					<li>
						<i class="jupiterx-icon-check-solid"></i>
						<?php esc_html_e( 'Advanced tracking options', 'jupiterx-lite' ); ?>
					</li>
					<li>
						<i class="jupiterx-icon-check-solid"></i>
						<?php esc_html_e( 'And much more...', 'jupiterx-lite' ); ?>
					</li>
				</ul>
			</div>
		</div>
	<?php
		endif;
	?>

	<div class="row jupiterx-cp-help-section">
		<div class="col">
			<h3 class="heading-with-icon icon-learn"><?php esc_html_e( 'Learn', 'jupiterx-lite' ); ?></h3>
			<?php do_action( 'jupiterx_control_panel_get_started' ); ?>
			<a class="btn btn-primary js__deactivate-product mb-4" href="https://help.artbees.net/getting-started" target="_blank"><?php esc_html_e( 'Get Started Guide', 'jupiterx-lite' ); ?></a>
			<h6><?php esc_html_e( 'Learn deeper:', 'jupiterx-lite' ); ?></h6>
			<ul class="list-unstyled d-inline-block">
				<li><a class="list-with-icon icon-video" target="_blank" href="https://themes.artbees.net/support/jupiterx/videos/"><?php esc_html_e( 'Video Tutorials', 'jupiterx-lite' ); ?></a></li>
				<li><a class="list-with-icon icon-docs" target="_blank" href="https://help.artbees.net/"><?php esc_html_e( 'Articles', 'jupiterx-lite' ); ?></a></li>
			</ul>
			<ul class="list-unstyled d-inline-block">
				<li><a class="list-with-icon icon-community" target="_blank" href="http://forums.artbees.net/"><?php esc_html_e( 'Community Forum', 'jupiterx-lite' ); ?></a></li>
				<li><a class="list-with-icon icon-history" target="_blank" href="<?php echo jupiterx_is_premium() ? 'https://themes.artbees.net/support/jupiterx/release-notes/' : 'https://themes.artbees.net/support/jupiterx-lite-release-notes/'; ?>"><?php esc_html_e( 'Release History', 'jupiterx-lite' ); ?></a></li>
			</ul>
		</div>
		<div class="col">
			<h3 class="heading-with-icon icon-download"><?php esc_html_e( 'Start with a Template', 'jupiterx-lite' ); ?></h3>
			<p><?php esc_html_e( 'Save time by choosing among beautiful templates designed for different sectors and purposes.', 'jupiterx-lite' ); ?></p>
			<a class="btn btn-secondary jupiterx-cpanel-link" href="#install-templates"><?php esc_html_e( 'Import a Template', 'jupiterx-lite' ); ?></a>
		</div>
	</div>
</div>
