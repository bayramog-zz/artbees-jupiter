<?php
/**
 * Add Jupiter Post Options > Footer meta options.
 *
 * @package JupiterX\Framework\Admin\Custom_Fields
 *
 * @since   1.0.0
 */

$key    = 'field_jupiterx_post_footer';
$parent = 'group_jupiterx_post';

// Footer tab.
acf_add_local_field( [
	'key'    => "{$key}_tab",
	'parent' => $parent,
	'label'  => __( 'Footer', 'jupiterx-lite' ),
	'type'   => 'tab',
] );

// Footer.
acf_add_local_field( [
	'key'           => $key,
	'parent'        => $parent,
	'label'         => __( 'Footer', 'jupiterx-lite' ),
	'name'          => 'jupiterx_footer',
	'type'          => 'true_false',
	'wrapper'       => [ 'width' => '50' ],
	'default_value' => 1,
	'ui'            => 1,
] );

// Type.
acf_add_local_field( [
	'key'               => "{$key}_type",
	'parent'            => $parent,
	'label'             => __( 'Type', 'jupiterx-lite' ),
	'name'              => 'jupiterx_footer_type',
	'type'              => 'button_group',
	'conditional_logic' => [
		[
			[
				'field'    => $key,
				'operator' => '==',
				'value'    => '1',
			],
		],
	],
	'wrapper'           => [ 'width' => '50' ],
	'choices'           => [
		'global'  => __( 'Global', 'jupiterx-lite' ),
		'_custom' => __( 'Custom', 'jupiterx-lite' ),
	],
	'default_value'     => 'global',
] );

// Template.
acf_add_local_field( [
	'key'               => "{$key}_template",
	'parent'            => $parent,
	'label'             => __( 'Template', 'jupiterx-lite' ),
	'name'              => 'jupiterx_footer_template',
	'type'              => 'jupiterx_template',
	'conditional_logic' => [
		[
			[
				'field'    => "{$key}_type",
				'operator' => '==',
				'value'    => '_custom',
			],
		],
	],
	'wrapper'           => [ 'width' => '50' ],
	'choices'           => JupiterX_Customizer_Utils::get_templates( 'footer', [
		'global' => __( 'Global', 'jupiterx-lite' ),
	] ),
	'default_value'     => 'global',
	'template_type'     => 'footer',
] );

// Divider.
acf_add_local_field( [
	'key'    => "{$key}_divider",
	'parent' => $parent,
	'type'   => 'jupiterx-divider',
] );

if ( '_custom' !== get_theme_mod( 'jupiterx_footer_type', '' ) ) {
	// Footer.
	acf_add_local_field( [
		'key'     => "{$key}_widget_area",
		'parent'  => $parent,
		'label'   => __( 'Widget Area', 'jupiterx-lite' ),
		'name'    => 'jupiterx_footer_widget_area',
		'type'    => 'button_group',
		'conditional_logic' => [
			[
				[
					'field'    => "{$key}_type",
					'operator' => '!=',
					'value'    => '_custom',
				],
				[
					'field'    => $key,
					'operator' => '==',
					'value'    => '1',
				],
			],
		],
		'wrapper' => [ 'width' => '50' ],
		'choices' => [
			'global' => __( 'Global', 'jupiterx-lite' ),
			'1'      => __( 'Yes', 'jupiterx-lite' ),
			''       => __( 'No', 'jupiterx-lite' ),
		],
		'default_value' => 'global',
	] );

	// Sub Footer.
	acf_add_local_field( [
		'key'           => "{$key}_sub",
		'parent'        => $parent,
		'label'         => __( 'Sub Footer', 'jupiterx-lite' ),
		'name'          => 'jupiterx_footer_sub',
		'type'          => 'button_group',
		'conditional_logic' => [
			[
				[
					'field'    => "{$key}_type",
					'operator' => '!=',
					'value'    => '_custom',
				],
				[
					'field'    => $key,
					'operator' => '==',
					'value'    => '1',
				],
			],
		],
		'wrapper'       => [ 'width' => '50' ],
		'choices'       => [
			'global' => __( 'Global', 'jupiterx-lite' ),
			'1'      => __( 'Yes', 'jupiterx-lite' ),
			''       => __( 'No', 'jupiterx-lite' ),
		],
		'default_value' => 'global',
	] );
}

// Behavior - Global site width.
if ( 'full_width' === get_theme_mod( 'jupiterx_site_width', 'full_width' ) ) {
	acf_add_local_field( [
		'key'           => "{$key}_behavior",
		'parent'        => $parent,
		'label'         => __( 'Behavior', 'jupiterx-lite' ),
		'name'          => 'jupiterx_footer_behavior',
		'type'          => 'button_group',
		'conditional_logic' => [
			[
				[
					'field'    => "{$key}_widget_area",
					'operator' => '!=',
					'value'    => '',
				],
				[
					'field'    => $key,
					'operator' => '==',
					'value'    => '1',
				],
			],
			[
				[
					'field'    => "{$key}_sub",
					'operator' => '!=',
					'value'    => '',
				],
				[
					'field'    => $key,
					'operator' => '==',
					'value'    => '1',
				],
			],
		],
		'choices'       => [
			'global' => __( 'Global', 'jupiterx-lite' ),
			'static' => __( 'Static', 'jupiterx-lite' ),
			'fixed'  => __( 'Fixed', 'jupiterx-lite' ),
		],
		'default_value' => 'global',
	] );
}
