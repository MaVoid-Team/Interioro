'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('portfolio_projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      slug: {
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: true,
      },
      title_en: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      title_ar: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      summary_en: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      summary_ar: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      description_en: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      description_ar: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      cover_image_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      cover_image_public_id: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('portfolio_projects', ['active']);
    await queryInterface.addIndex('portfolio_projects', ['sort_order']);

    await queryInterface.createTable('portfolio_project_images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'portfolio_projects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      image_url: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      image_public_id: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      alt_en: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      alt_ar: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('portfolio_project_images', ['project_id']);
    await queryInterface.addIndex('portfolio_project_images', ['sort_order']);

    const requestColumns = {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      full_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      inspiration_images: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      status: {
        type: Sequelize.ENUM('new', 'contacted', 'closed'),
        allowNull: false,
        defaultValue: 'new',
      },
      internal_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    };

    await queryInterface.createTable('custom_design_requests', {
      ...requestColumns,
      project_type_or_space: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      vision_description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      style_preferences: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      dimensions: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      budget: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      timeline: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    });

    await queryInterface.addIndex('custom_design_requests', ['status']);
    await queryInterface.addIndex('custom_design_requests', ['created_at']);

    await queryInterface.createTable('special_piece_requests', {
      ...requestColumns,
      desired_piece_type: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      vision_description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      dimensions: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      budget: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      timeline: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    });

    await queryInterface.addIndex('special_piece_requests', ['status']);
    await queryInterface.addIndex('special_piece_requests', ['created_at']);

    await queryInterface.createTable('consultation_requests', {
      ...requestColumns,
      preferred_contact_method: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      question_summary: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      preferred_days: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      preferred_time_window: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    });

    await queryInterface.addIndex('consultation_requests', ['status']);
    await queryInterface.addIndex('consultation_requests', ['created_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('consultation_requests');
    await queryInterface.dropTable('special_piece_requests');
    await queryInterface.dropTable('custom_design_requests');
    await queryInterface.dropTable('portfolio_project_images');
    await queryInterface.dropTable('portfolio_projects');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_custom_design_requests_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_special_piece_requests_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_consultation_requests_status";');
  },
};
