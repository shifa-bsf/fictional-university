<?php
require get_theme_file_path('/inc/page-banner.php');
require get_theme_file_path('/inc/search-route.php');

function university_files()
{
  wp_enqueue_script('main-university-js', get_theme_file_uri('/build/index.js'), array('jquery'), '1.0', true);
  wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
  wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
  wp_enqueue_style('university_main_styles', get_theme_file_uri('/build/style-index.css'));
  wp_enqueue_style('university_extra_styles', get_theme_file_uri('/build/index.css'));
  wp_localize_script('main-university-js','universityData',array(
    'root_url' => get_site_url(),
    'nonce' => wp_create_nonce('wp_rest')
  ));//wp_localize_script used to make PHP data available to JavaScript code.
}

add_action('wp_enqueue_scripts', 'university_files');

function university_features()
{
  add_theme_support('title-tag');
  add_theme_support( 'post-thumbnails' );
  add_image_size('professorLandscape', 400, 250, true);
  add_image_size('professorPortrait', 450, 600, true);
  add_image_size('pageBanner', 1500, 350, true);  
}

add_action('after_setup_theme', 'university_features');

function university_adjust_queries($query)
{
  if (!is_admin() and is_post_type_archive('event') and $query->is_main_query()) {
    $today = date('Ymd');
    $query->set('meta_key', 'event_date');
    $query->set('orderby', 'meta_value_num');
    $query->set('order', 'ASC');
    $query->set('meta_query', array(
      array(
        'key' => 'event_date',
        'compare' => '>=',
        'value' => $today,
        'type' => 'numeric'
      )
    )
    );

  }
  if (!is_admin() AND is_post_type_archive('program') AND $query->is_main_query()) {
    $query->set('orderby', 'title');
    $query->set('order', 'ASC');
    $query->set('posts_per_page', -1);
  }
}

add_action('pre_get_posts', 'university_adjust_queries');



//Adding custom field to wp rest api
function university_custom_rest(){
  register_rest_field('post','authorName', array(
  'get_callback'=> function(){
    return get_the_author();
    }
  ));
  register_rest_field('note', 'userNoteCount', array(
    'get_callback' => function() {
      return count_user_posts(get_current_user_id(), 'note');
    }
  ));
}
add_action('rest_api_init', 'university_custom_rest');

//Redirect subsciber user to home page
add_action('admin_init','redirectSubscriber');
function redirectSubscriber (){
  $currentUser = wp_get_current_user();
  if(count($currentUser->roles)==1 AND $currentUser->roles[0] == 'subscriber'){
    wp_redirect(site_url('/'));
    exit;
  }
}
//hide admin bar for subscribers
add_action('wp_loaded','hideAdminbar');
function hideAdminbar(){
  $currentUser = wp_get_current_user();
  if(count($currentUser->roles)==1 AND $currentUser->roles[0] == 'subscriber'){
    show_admin_bar(false);
  }
}

//custom login page
add_filter('login_headerurl', 'setLoginHeaderUrl');
function setLoginHeaderUrl(){
  return esc_url(site_url('/'));
}

add_action('login_enqueue_scripts', 'setLoginCSS');
function setLoginCSS() {
  wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
  wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
  wp_enqueue_style('university_main_styles', get_theme_file_uri('/build/style-index.css'));
  wp_enqueue_style('university_extra_styles', get_theme_file_uri('/build/index.css'));
}

add_filter('login_headertitle', 'setLoginTitle');

function setLoginTitle() {
  return get_bloginfo('name');
}

// Adding conditions while creating note post
add_filter('wp_insert_post_data', 'makeNotePrivate',10,2);
function makeNotePrivate($data, $postarr) {
  if ($data['post_type'] == 'note') {
    if(count_user_posts(get_current_user_id(), 'note') > 4 AND !$postarr['ID']) {
      die("You have reached your note limit. Delete existing note to add a new note.");
    }

    $data['post_content'] = sanitize_textarea_field($data['post_content']);
    $data['post_title'] = sanitize_text_field($data['post_title']);
  }

  if($data['post_type'] == 'note' AND $data['post_status'] != 'trash') {
    $data['post_status'] = "private";
  }
  return $data;
}